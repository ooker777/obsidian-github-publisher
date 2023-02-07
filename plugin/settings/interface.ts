import { TFile } from "obsidian";
import { settings, subSettings } from "../i18n";

export interface GitHubPublisherSettings {
	github: {
		user: string;
		repo: string;
		branch: string;
		token: string;
		automaticallyMergePR: boolean;
		api: {
			tiersForApi: GithubTiersVersion;
			hostname: string;
		}
		worflow: {
			customCommitMsg: string;
			workflowName: string;
		}
	}
	upload: {
		behavior: FolderSettings;
		subFolder: string;
		defaultName: string;
		rootFolder: string;
		yamlFolderKey: string;
		frontmatterTitle: {
			enable: boolean;
			key: string;
		}
		replaceTitle: {
			regex: string;
			replacement: string;
		},
		autoclean: {
			enable: boolean;
			excluded: string[];
		}
		folderNote: {
			enable: boolean;
			rename: string;
		}
		metadataExtractorPath: string;
	}
	conversion: {
		hardbreak: boolean;
		dataview: boolean;
		censorText: TextCleaner[];
		tags: {
			inline: boolean;
			exclude: string[];
			fields: string[];
		}
		links: {
			internal: boolean;
			unshared: boolean;
			wiki: boolean;
		}
	}
	embed: {
		attachments: boolean;
		keySendFile: string[];
		notes: boolean;
		folder: string;
	}
	plugin:
	{
		shareKey: string;
		fileMenu: boolean;
		editorMenu: boolean;
		excludedFolder: string[];
		externalShare: boolean;
		copyLink: {
			enable: boolean;
			links: string;
			removePart: string[];
		}
		noticeError: boolean;
	}
}

/**
 * @interface GitHubPublisherSettings
 * @description The settings for the GitHub Publisher plugin
 * @property {string} GhToken - The GitHub token
 * @property {string} githubName - The GitHub username
 * @property {string} githubRepo - The GitHub repo
 * @property {string} githubBranch - The GitHub branch
 * @property {string} shareKey - The share key for the plugin to work
 * @property {string[]} excludedFolder - The folder where the plugin can't publish
 * @property {boolean} fileMenu If the file menu should be displayed
 * @property {boolean} editorMenu If the editor menu should be displayed
 * @property {string} downloadedFolder folder settings (see FolderSettings)
 * @property {string} yamlFolderKey the category key in the frontmatter
 * @property {string} folderDefaultName the default folder
 * @property {string} rootFolder the root folder of the repo
 * @property {string} workflowName the name of the github actions to run
 * @property {boolean} embedImage If the plugin should send the embedded images
 * @property {string} defaultImageFolder the default folder for the embedded images
 * @property {boolean} autoCleanUp If the plugin should delete the files that are not in the vault
 * @property {string[]} autoCleanUpExcluded File excluded from the auto clean up
 * @property {boolean} folderNote If folderNote must be renamed to index.md
 * @property {boolean} convertWikiLinks If the plugin should convert the wiki links to markdown links
 * @property {boolean} convertForGithub Convert the internal links to relative links based on repo path
 * @property {string} subFolder remove the subfolder from the path
 * @property {boolean} embedNotes If the plugin should also send the note embedded in a file
 * @property {boolean} copyLink Allow to create a link passed to the clipboard
 * @property {string} mainLink the main link to the repo
 * @property {string} linkRemover Remove part of the link
 * @property {string} hardBreak If the plugin should convert the normal line break to hard break
 * @property {boolean} logNotice If the plugin must send in a notice the log
 * @property {boolean} convertDataview If the plugin should convert the dataview queries to normal markdown
 * @property {boolean} useFrontmatterTitle If the plugin should use the frontmatter title instead of the file name
 * @property {TextCleaner[]} censorText censor text in the file using regex
 * @property {boolean} inlineTags Send the inlines tags into the frontmatter
 * @property {string[]} dataviewFields Fields to send to the frontmatter as tags
 * @property {string} frontmatterTitleKey The key to use for the frontmatter title
 * @property {string[]} excludeDataviewValue never add this value as tags
 * @property {string[]} metadataFileFields Field linked to note to send along the other files
 * @property {boolean} shareExternalModified share file when modified externally
 * @property {boolean} automaticallyMergePR remove the automatic merge of the PR
 * @property {string} metadataExtractorPath the path where to put the json generated by metadata extractor
 */
export interface OldSettings {
	githubRepo: string;
	githubName: string;
	GhToken: string;
	githubBranch: string;
	shareKey: string;
	excludedFolder: string[];
	fileMenu: boolean;
	editorMenu: boolean;
	downloadedFolder: string;
	folderDefaultName: string;
	yamlFolderKey: string;
	rootFolder: string;
	workflowName: string;
	customCommitMsg: string;
	embedImage: boolean;
	defaultImageFolder: string;
	autoCleanUp: boolean;
	autoCleanUpExcluded: string[];
	folderNote: boolean;
	folderNoteRename: string;
	convertWikiLinks: boolean;
	convertForGithub: boolean;
	subFolder: string;
	embedNotes: boolean;
	copyLink: boolean;
	mainLink: string;
	linkRemover: string;
	hardBreak: boolean;
	logNotice: boolean;
	convertDataview: boolean;
	useFrontmatterTitle: boolean;
	censorText: TextCleaner[];
	inlineTags: boolean;
	dataviewFields: string[];
	frontmatterTitleKey: string;
	excludeDataviewValue: string[];
	metadataFileFields: string[];
	shareExternalModified: boolean;
	automaticallyMergePR: boolean;
	metadataExtractorPath: string;
	convertInternalNonShared: boolean;
	frontmatterTitleRegex: string;
	frontmatterTitleReplacement: string;
	tiersForApi: GithubTiersVersion;
	hostname: string;
}

/**
 * Allow to set a value for the folder settings
 * @enum FolderSettings
 */
export enum FolderSettings {
	yaml = "yaml",
	obsidian = "obsidian",
	fixed = "fixed",
}

export enum GithubTiersVersion {
	free = "Github Free/Pro/Team (default)",
	entreprise = "Enterprise",
}

export const DEFAULT_SETTINGS: GitHubPublisherSettings = {
	github: {
		user: "",
		repo: "",
		branch: "main",
		token: "",
		automaticallyMergePR: true,
		api: {
			tiersForApi: GithubTiersVersion.free,
			hostname: "",
		},
		worflow: {
			customCommitMsg: "",
			workflowName: "",
		},
	},
	upload: {
		behavior: FolderSettings.fixed,
		subFolder: "",
		defaultName: "",
		rootFolder: "",
		yamlFolderKey: "",
		frontmatterTitle: {
			enable: false,
			key: "title",
		},
		replaceTitle: {
			regex: "",
			replacement: "",
		},
		autoclean: {
			enable: false,
			excluded: [],
		},
		folderNote: {
			enable: false,
			rename: "index.md",
		},
		metadataExtractorPath: "",
	},
	conversion: {
		hardbreak: false,
		dataview: true,
		censorText: [],
		tags: {
			inline: false,
			exclude: [],
			fields: [],
		},
		links: {
			internal: false,
			unshared: false,
			wiki: false,
		},
	},
	embed: {
		attachments: true,
		keySendFile: [],
		notes: false,
		folder: "",
	},
	plugin: {
		shareKey: "share",
		fileMenu: false,
		editorMenu: false,
		excludedFolder: [],
		externalShare: false,
		copyLink: {
			enable: false,
			links: "",
			removePart: [],
		},
		noticeError: false,
	}
};

export interface MetadataExtractor {
	allExceptMdFile: string | null;
	metadataFile: string | null;
	tagsFile: string | null;
}

export interface LinkedNotes {
	linked: TFile;
	linkFrom: string;
	altText: string;
	destinationFilePath?: string;
	anchor?: string;
}

export interface ConvertedLink {
	converted: string;
	real: string;
	repoFrontmatter?: RepoFrontmatter | RepoFrontmatter[];
}

export interface GithubRepo {
	file: string;
	sha: string;
}

export interface TextCleaner {
	entry: string;
	replace: string;
	after: boolean;
	flags: string;
}

export const PUBLISHER_TABS = {
	"github-configuration": {
		name: settings("github", "githubConfiguration") as string,
		icon: "cloud",
	},
	"upload-configuration": {
		name: settings("uploadConfig", "title") as string,
		icon: "upload",
	},
	"text-conversion": {
		name: settings("textConversion", "textConversion") as string,
		icon: "file-text",
	},
	"embed-configuration": {
		name: settings("embed", "embed") as string,
		icon: "link",
	},
	"plugin-settings": {
		name: settings("plugin", "pluginSettings") as string,
		icon: "gear",
	},
	help: {
		name: subSettings("help.help") as string,
		icon: "info",
	},
};

export interface FrontmatterConvert {
	links: boolean;
	attachment: boolean;
	embed: boolean;
	attachmentLinks: string;
	convertWiki: boolean;
	removeEmbed: boolean;
	dataview: boolean;
	hardbreak: boolean;
	convertInternalNonShared: boolean;
	convertInternalLinks: boolean;
}

export interface RepoFrontmatter {
	branch: string;
	repo: string;
	owner: string;
	autoclean: boolean;
}
