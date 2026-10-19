import { Link, useLocation, useNavigate } from 'react-router';
import { scrollToSection, scrollToSectionAfterRender } from '../../lib/smoothScroll';

/**
 * Link to "/path?query#section".
 * - On another page it is a normal Link (ScrollRestoration lands on the hash).
 * - On the same page, a plain section link (no query) only scrolls; it keeps
 *   the current query, so an active search is not wiped.
 * - A link that carries a query (e.g. a neighbourhood filter) applies it
 *   first and scrolls once the new results have rendered, so the target is
 *   measured against the final layout.
 */
export default function HashLink({ to, onClick, ...props }) {
  const location = useLocation();
  const navigate = useNavigate();

  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const url = new URL(to, window.location.origin);
    if (url.pathname !== location.pathname || !url.hash) return;

    event.preventDefault();
    const id = decodeURIComponent(url.hash.slice(1));
    if (url.search && url.search !== location.search) {
      scrollToSectionAfterRender(id);
      navigate(url.pathname + url.search, { preventScrollReset: true });
    } else {
      scrollToSection(id);
    }
  }

  return <Link to={to} onClick={handleClick} {...props} />;
}
