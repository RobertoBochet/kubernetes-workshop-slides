export type Author = { name: string; email?: string }

export const getTitle = ($slidev: unknown): string => $slidev.configs.title

export const getAuthors = ($slidev: unknown): Author[] =>
  $slidev.configs.author
    ?.split(",")
    .map((i: string) => i.trim())
    .map((i: string) => i.match(/^([^<>]+[^ ]) ?(?:<(.*)>)?$/))
    .map((i: string[]) => ({ name: i[1], email: i[2] }))
