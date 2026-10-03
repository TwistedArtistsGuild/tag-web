import EntityContextNav from "@/components/portal/EntityContextNav"

export default function BoardContextNav() {
  const items = [
    {
      key: "board-home",
      label: "Board Home",
      href: "/portal/board",
      purpose: "Top-level board workspace and dashboard.",
    },
    {
      key: "board-motions",
      label: "Motions",
      href: "/portal/board/motions",
      purpose: "Review, second, and vote on board motions.",
    },
  ]

  return <EntityContextNav title="Board Context" items={items} />
}