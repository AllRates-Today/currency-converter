import Converter from '@/components/Converter';

export default function Home() {
  return (
    <main>
      <section className="hero">
        <span className="hero-badge">Powered by @allratestoday/sdk</span>
        <h1>
          Live currency <span className="accent">converter</span>
        </h1>
        <p>
          Real-time mid-market exchange rates for 160+ currencies with a free
          key, or official ECB reference rates with no key at all.
        </p>
      </section>

      <Converter />

      <pre className="code-block">
        <code>
          <span className="comment">{'// npm install @allratestoday/sdk'}</span>
          {'\n'}
          <span className="keyword">import</span>{' '}
          {'{ '}AllRatesToday{' }'} <span className="keyword">from</span>{' '}
          <span className="string">&apos;@allratestoday/sdk&apos;</span>;{'\n\n'}
          <span className="keyword">const</span> client ={' '}
          <span className="keyword">new</span>{' '}
          <span className="func">AllRatesToday</span>({'{ '}apiKey: <span className="string">&apos;YOUR_KEY&apos;</span>{' }'});{'\n'}
          <span className="keyword">const</span> result ={' '}
          <span className="keyword">await</span> client.
          <span className="func">convert</span>(
          <span className="string">&apos;USD&apos;</span>,{' '}
          <span className="string">&apos;EUR&apos;</span>, 100);{'\n'}
          console.<span className="func">log</span>(result.result);{' '}
          <span className="comment">{'// → 89.22'}</span>
        </code>
      </pre>

      <footer className="footer">
        Built with <a href="https://www.npmjs.com/package/@allratestoday/sdk">@allratestoday/sdk</a>{' '}
        — data from{' '}
        <a href="https://allratestoday.com">AllRatesToday</a>.{' '}
        <a href="https://github.com/allratestoday/currency-converter">View source on GitHub</a>.
      </footer>
    </main>
  );
}
