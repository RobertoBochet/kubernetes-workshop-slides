import cc0Badge from "../assets/CC0-1.0.svg"
import ccBy4Badge from "../assets/CC-BY-4.0.svg"
import ccBySa4Badge from "../assets/CC-BY-SA-4.0.svg"

export type SourceCodeProvider = "github" | "gitlab" | "generic"

export type LicenseID = "CC0-1.0" | "CC-BY-4.0" | "CC-BY-SA-4.0"

const licenseData = {
  "CC0-1.0": {
    link: "https://creativecommons.org/publicdomain/zero/1.0/",
    badge: cc0Badge,
    name: "Creative Commons Zero v1.0 Universal"
  },
  "CC-BY-4.0": {
    link: "https://creativecommons.org/licenses/by/4.0/",
    badge: ccBy4Badge,
    name: "Creative Commons Attribution 4.0 International License"
  },
  "CC-BY-SA-4.0": {
    link: "https://creativecommons.org/licenses/by-sa/4.0/",
    badge: ccBySa4Badge,
    name: "Creative Commons Attribution-ShareAlike 4.0 International License"
  }
} as const

const getLicenseID = ($slidev: unknown) => <LicenseID | undefined>$slidev.configs.license

export const getLicense = ($slidev: unknown) => {
  const licenseID = getLicenseID($slidev)
  if (!licenseID) return undefined
  return licenseData[licenseID]
}

const getSourceCodeUrl = ($slidev: unknown) => <string | undefined>$slidev.configs.sourceCode

const computeSourceCodeProvider = (url: string): SourceCodeProvider => {
  if (/(https?:\/\/)?github/.test(url)) return "github"
  if (/(https?:\/\/)?gitlab/.test(url)) return "gitlab"
  if (/(https?:\/\/)?git\.poul\.org/.test(url)) return "gitlab"
  return "generic"
}

export const getSourceCode = ($slidev: unknown) => {
  const sourceCodeUrl = getSourceCodeUrl($slidev)
  if (!sourceCodeUrl) return undefined

  return {
    url: sourceCodeUrl,
    provider: computeSourceCodeProvider(sourceCodeUrl)
  }
}
