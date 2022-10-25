import {Octokit} from "@octokit/core";
import {GitHubPublisherSettings, RepoFrontmatter} from "../settings/interface";
import {FilesManagement} from "./filesManagement";
import {MetadataCache, Notice, Vault} from "obsidian";
import GithubPublisherPlugin from "../main";
import t from "../i18n";

export class GithubBranch extends FilesManagement {
	settings: GitHubPublisherSettings;
	octokit: Octokit;
	vault: Vault;
	metadataCache: MetadataCache;
	plugin: GithubPublisherPlugin;

	constructor(settings: GitHubPublisherSettings,
		octokit: Octokit,
		vault: Vault,
		metadataCache: MetadataCache,
		plugin: GithubPublisherPlugin) {
		super(vault, metadataCache, settings, octokit, plugin);
		this.settings = settings;
		this.octokit = octokit;
		this.plugin = plugin;
	}

	async newBranch(branchName: string, repoFrontmatter: RepoFrontmatter) {
		/**
		 * Create a new branch on the repo named "Vault-date"
		 * Pass if the branch already exists
		 * @param branchName
		 */

		const allBranch = await this.octokit.request('GET' + ' /repos/{owner}/{repo}/branches', {
			owner: repoFrontmatter.owner,
			repo: repoFrontmatter.repo,
		});
		const mainBranch = allBranch.data.find((branch: { name: string; }) => branch.name === repoFrontmatter.branch);
		const shaMainBranch = mainBranch.commit.sha;

		try {
			const branch = await this.octokit.request(
				"POST" + " /repos/{owner}/{repo}/git/refs",
				{
					owner: repoFrontmatter.owner,
					repo: repoFrontmatter.repo,
					ref: "refs/heads/" + branchName,
					sha: shaMainBranch,
				}
			);
			return branch.status === 201;
		} catch (e) {
			// catch the old branch
			const allBranch = await this.octokit.request('GET' + ' /repos/{owner}/{repo}/branches', {
				owner: repoFrontmatter.owner,
				repo: repoFrontmatter.repo,
			});
			const mainBranch = allBranch.data.find((branch: { name: string; }) => branch.name === branchName);
			return !!mainBranch;
		}
	}

	async pullRequest(branchName: string, repoFrontmatter: RepoFrontmatter) {
		/**
		 * Create a pull request on main/master from the new branch
		 * @param branchName
		 */

		try {
			const PR = await this.octokit.request('POST' +
				' /repos/{owner}/{repo}/pulls', {
				owner: repoFrontmatter.owner,
				repo: repoFrontmatter.repo,
				title: `PullRequest ${branchName} from Obsidian`,
				body: "",
				head: branchName,
				base: repoFrontmatter.branch,
			});
			return PR.data.number;
		} catch (e) {
			const PR = await this.octokit.request('GET' + ' /repos/{owner}/{repo}/pulls', {
				owner: repoFrontmatter.owner,
				repo: repoFrontmatter.repo,
				state: 'open',
			});
			return PR.data[0].number;
		}
	}

	async deleteBranch(branchName: string, repoFrontmatter: RepoFrontmatter) {
		/**
		 * After the merge, delete the new branch
		 * @param branchName
		 */

		try {
			const branch = await this.octokit.request(
				"DELETE" + " /repos/{owner}/{repo}/git/refs/heads/" + branchName,
				{
					owner: repoFrontmatter.owner,
					repo: repoFrontmatter.repo,
				}
			);
			return branch.status === 200;
		} catch (e) {
			return false;
		}
	}


	async mergePullRequest (branchName: string, silent = false, pullRequestNumber: number, repoFrontmatter: RepoFrontmatter) {
		/**
		 * Automatically merge pull request from the plugin
		 * @param branchName
		 * @param silent No logging message
		 * @param pullRequestNumber number of the new pullrequest
		 */

		try {
			const branch = await this.octokit.request(
				"PUT" + " /repos/{owner}/{repo}/pulls/{pull_number}/merge",
				{
					owner: repoFrontmatter.owner,
					repo: repoFrontmatter.repo,
					pull_number: pullRequestNumber,
					commit_title: `[PUBLISHER] Merge #${pullRequestNumber}`,
					merge_method: "squash",
				}
			);
			return branch.status === 200;

		} catch (e) {
			new Notice(t('mergeconflic') as string);
			return false;
		}
	}
	async updateRepository(branchName: string, repoFrontmatter: RepoFrontmatter) {
		/**
		 * Run merging + deleting branch in once
		 * @param branchName
		 */

		const pullRequest = await this.pullRequest(branchName, repoFrontmatter);
		const PRSuccess = await this.mergePullRequest(branchName, true, pullRequest, repoFrontmatter);
		if (PRSuccess) {
			await this.deleteBranch(branchName, repoFrontmatter);
			return true
		}
		return false
	}
}
