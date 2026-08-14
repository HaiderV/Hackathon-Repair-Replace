import Nav from "./Nav"

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="wood-ground min-h-screen">
      <Nav />
      {children}
    </div>
  )
}
