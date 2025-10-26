import {
  Directive,
  ElementRef,
  HostListener,
  input,
  InputSignal,
  OnDestroy,
  Renderer2,
} from '@angular/core';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type TooltipPositionParameter = TooltipPosition  | 'auto';

interface ViewportBoundaries {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
}

@Directive({
  standalone: true,
  selector: '[appTooltip]',
})
export class TooltipDirective implements OnDestroy {
  readonly appTooltip = input.required<string>();
  readonly tooltipPosition: InputSignal<TooltipPositionParameter> = input('auto' as TooltipPositionParameter);
  readonly tooltipDelay: InputSignal<number> = input(0);
  readonly viewportMargin: InputSignal<number> = input(8); // Minimum margin from viewport edges

  private tooltipElement: HTMLElement | null = null;
  private delayTimeout: number | undefined;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    console.log("onMouseEnter()");

    if (this.appTooltip() && !this.tooltipElement) {
      if (this.tooltipDelay) {
        this.delayTimeout = setTimeout(() => {
          this.showTooltip();
        }, this.tooltipDelay());
      } else {
        this.showTooltip();
      }
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    console.log("onMouseLeave()");
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
    this.hideTooltip();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onWindowChange(): void {
    if (this.tooltipElement) {
      this.positionTooltip();
    }
  }

  private showTooltip(): void {
    console.log("showTooltip");
    this.tooltipElement = this.renderer.createElement('div');
    const text = this.renderer.createText(this.appTooltip());

    this.renderer.appendChild(this.tooltipElement, text);
    this.renderer.addClass(this.tooltipElement, 'custom-tooltip');

    this.renderer.appendChild(document.body, this.tooltipElement);
    this.positionTooltip();
  }

  private hideTooltip(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }

  private positionTooltip(): void {
    if (!this.tooltipElement) {
      return;
    }

    console.log("positionTooltip");
    const viewport = this.getViewportBoundaries();
    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();

    // Determine the best position
    const bestPosition: TooltipPosition = this.tooltipPosition() === 'auto'
      ? this.findBestPosition(hostRect, tooltipRect, viewport)
      : this.tooltipPosition() as TooltipPosition;

    // Remove all position classes
    ['tooltip-top', 'tooltip-bottom', 'tooltip-left', 'tooltip-right'].forEach(className => {
      this.renderer.removeClass(this.tooltipElement, className);
    });

    // Add the chosen position class
    this.renderer.addClass(this.tooltipElement, `tooltip-${bestPosition}`);

    // Calculate position
    const position = this.calculatePosition(hostRect, tooltipRect, bestPosition, viewport);
    console.log("position: ", position);

    this.renderer.setStyle(this.tooltipElement, 'top', `${position.top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${position.left}px`);
  }

  private getViewportBoundaries(): ViewportBoundaries {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    return {
      top: scrollY + this.viewportMargin(),
      bottom: scrollY + window.innerHeight - this.viewportMargin(),
      left: scrollX + this.viewportMargin(),
      right: scrollX + window.innerWidth - this.viewportMargin(),
      width: window.innerWidth - (this.viewportMargin() * 2),
      height: window.innerHeight - (this.viewportMargin() * 2),
    };
  }

  private findBestPosition(
    hostRect: DOMRect,
    tooltipRect: DOMRect,
    viewport: ViewportBoundaries,
  ): TooltipPosition {
    const positions = ['top', 'bottom', 'left', 'right'] as const;
    const positionScores = new Map<string, number>();

    for (const position of positions) {
      const calculatedPos = this.calculatePosition(hostRect, tooltipRect, position, viewport);
      const tooltipArea = {
        left: calculatedPos.left,
        right: calculatedPos.left + tooltipRect.width,
        top: calculatedPos.top,
        bottom: calculatedPos.top + tooltipRect.height,
      };

      // Calculate how much of the tooltip is within viewport
      const visibleWidth = Math.max(0,
        Math.min(tooltipArea.right, viewport.right) -
        Math.max(tooltipArea.left, viewport.left),
      );
      const visibleHeight = Math.max(0,
        Math.min(tooltipArea.bottom, viewport.bottom) -
        Math.max(tooltipArea.top, viewport.top),
      );

      const visibleArea = visibleWidth * visibleHeight;
      const totalArea = tooltipRect.width * tooltipRect.height;
      const visibilityScore = visibleArea / totalArea;

      // Prefer positions that keep the tooltip fully visible
      const isFullyVisible = visibleArea === totalArea ? 2 : 0;

      positionScores.set(position, visibilityScore + isFullyVisible);
    }

    // Return the position with the highest score
    return Array.from(positionScores.entries())
      .reduce((best, current) => current[1] > best[1] ? current : best)[0] as TooltipPosition;
  }

  private calculatePosition(
    hostRect: DOMRect,
    tooltipRect: DOMRect,
    position: 'top' | 'bottom' | 'left' | 'right',
    viewport: ViewportBoundaries,
  ): { top: number; left: number } {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    let top: number;
    let left: number;

    // Calculate initial position
    switch (position) {
      case 'top':
        top = hostRect.top + scrollY - tooltipRect.height - 8;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + scrollY + 8;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left + scrollX - tooltipRect.width - 8;
        break;
      case 'right':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left + scrollX + hostRect.width + 8;
        break;
    }

    // Adjust to keep within viewport boundaries
    top = Math.max(viewport.top, Math.min(top, viewport.bottom - tooltipRect.height));
    left = Math.max(viewport.left, Math.min(left, viewport.right - tooltipRect.width));

    return { top, left };
  }

  ngOnDestroy(): void {
    this.hideTooltip();
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
  }
}
