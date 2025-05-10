export function calculateViewportConfig(mainView, comparisonView) {
  // Use real-world measurements directly with a conversion factor
  const INCH_TO_PIXEL = 10; // Conversion factor (e.g., 1 inch = 10 pixels)

  // Calculate total required width based on actual dimensions
  const totalWidthInches = Math.max(
    mainView?.totalWidth || 0,
    comparisonView?.totalWidth || 0
  );

  // Calculate padding
  const PADDING = 40; // Standard padding
  const viewportWidth = (totalWidthInches * INCH_TO_PIXEL) + (PADDING * 2);
  const viewportHeight = 400; // Standard height

  return {
    width: viewportWidth,
    height: viewportHeight,
    centerX: viewportWidth / 2,
    centerY: viewportHeight * 0.7, // Position slightly lower for better view
    padding: PADDING,
    pixelsPerInch: INCH_TO_PIXEL
  }
}
