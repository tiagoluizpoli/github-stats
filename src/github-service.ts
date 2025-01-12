import axios, { isAxiosError } from 'axios';
import { env } from './config';

const { token } = env.github;

const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' };

async function getAllRepos(): Promise<any[]> {
  const repos: any[] = [];
  let url = 'https://api.github.com/user/repos?per_page=100';

  while (url) {
    try {
      const response = await axios.get(url, { headers });
      repos.push(...response.data);
      const linkHeader = response.headers.link;
      const nextPageMatch = linkHeader?.match(/<([^>]+)>; rel="next"/);
      url = nextPageMatch ? nextPageMatch[1] : null;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('Failed to fetch repositories:', error.message);
      }
      break;
    }
  }

  return repos;
}

async function getCommitCountByAuthor(owner: string, repo: string, author: string): Promise<number> {
  let url = `https://api.github.com/repos/${owner}/${repo}/commits?author=${author}&per_page=100`;
  let totalCommits = 0;

  while (url) {
    try {
      const response = await axios.get(url, { headers });

      totalCommits += response.data.length;

      // Check for pagination in the `Link` header
      const linkHeader = response.headers.link;
      const nextPageMatch = linkHeader?.match(/<([^>]+)>; rel="next"/);
      url = nextPageMatch ? nextPageMatch[1] : null;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(`Failed to fetch commits for ${repo}:`, error.message);
      }
      break;
    }
  }

  return totalCommits;
}

export const getTotalCommitsByAuthor = async (username: string): Promise<number> => {
  const repos = await getAllRepos();
  let totalCommits = 0;

  for (const repo of repos) {
    const owner = repo.owner.login;
    const name = repo.name;
    const commitCount = await getCommitCountByAuthor(owner, name, username);
    console.log(`Commits by ${username} in ${name}: ${commitCount}`);
    totalCommits += commitCount;
  }

  console.log(`Total commits by ${username} across all repositories: ${totalCommits}`);

  return totalCommits;
};
