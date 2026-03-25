import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: [
            'body > nav { display: none !important; }',
            'body > footer { display: none !important; }',
            'body > main { padding: 0 !important; margin: 0 !important; }',
            'body { background: transparent !important; min-height: auto !important; }',
          ].join('\n'),
        }}
      />
      {children}
    </>
  )
}
