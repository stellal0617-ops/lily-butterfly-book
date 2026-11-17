import React from 'react';
export function StoryPage({ page, onComplete }) {
  const Content = page.Content;
  return <article className={`story-page theme-${page.theme || 'garden'}`} aria-label={page.title}>
    <header className="page-eyebrow"><span>{page.chapterLabel || 'THE BUTTERFLY MYSTERY'}</span><span>✿</span></header>
    <main className="page-main">
      {page.illustration && <div className="scene" aria-hidden="true">{page.illustration}</div>}
      <h2>{page.title}</h2>
      {page.subtitle && <p className="page-subtitle">{page.subtitle}</p>}
      <div className="page-body"><Content onComplete={onComplete} /></div>
    </main>
    <footer className="page-footer"><span>LILY & PIP • AN AI ADVENTURE</span><span>✦</span></footer>
  </article>;
}
