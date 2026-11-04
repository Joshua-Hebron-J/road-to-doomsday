/** Keep keyboard focus within the active modal, including nested dossier flows. */
export function trapDialogFocus(
  event: Pick<KeyboardEvent, 'key' | 'shiftKey' | 'preventDefault'>,
  container: HTMLElement,
) {
  if (event.key !== 'Tab') return;
  const controls = Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, summary, [tabindex]',
    ),
  ).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.matches(':disabled, [type="hidden"]') &&
      !element.closest('[hidden], [inert], [aria-hidden="true"]') &&
      element.getClientRects().length > 0 &&
      getComputedStyle(element).visibility !== 'hidden',
  );
  const first = controls[0];
  const last = controls.at(-1);
  const active = container.ownerDocument.activeElement;
  if (!first) {
    event.preventDefault();
    container.focus();
  } else if (
    event.shiftKey &&
    (active === first || !controls.includes(active as HTMLElement))
  ) {
    event.preventDefault();
    last?.focus();
  } else if (
    !event.shiftKey &&
    (active === last || !container.contains(active))
  ) {
    event.preventDefault();
    first.focus();
  }
}
