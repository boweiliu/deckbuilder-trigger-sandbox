import { Link } from 'react-router-dom';

function NotFound() {

  // compute the route to index page. needs to work even if we are deployed to gh pages under a subdirectory
  const origin = window.location.origin || 'http://localhost:5173';
  const href = window.location.href || `${origin}/index.html`;
  const url = new URL(href);
  url.hash = '';
  const hrefMinusHash = url.href;


  return (
    <>
      <h1>Not Found</h1>
      <Link to="/">GO HOME</Link>
      <iframe
        title="nest-test"
        style={{
          border: '0px',
          width: '948px',
          height: '533px',
          position: 'absolute',
          left: 0,
        }}
        sandbox="allow-scripts allow-pointer-lock"
        allowFullScreen
        src={hrefMinusHash}
      />
      <div style={{ height: '533px' }}>spacer</div>
      <h2>blah blah</h2>
      <h2>blah blah</h2>
      <h2>blah blah</h2>
    </>
  );
}

export default NotFound;
