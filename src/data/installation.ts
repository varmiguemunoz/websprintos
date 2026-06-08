export interface InstallTab {
  id: string;
  label: string;
  command: string;
  comment: string;
}

export const installationTabs: InstallTab[] = [
  {
    id: 'macos',
    label: 'macOS',
    command: 'brew install varmiguemunoz/sprintos/sprintos',
    comment: '# Homebrew — recommended for macOS',
  },
  {
    id: 'linux',
    label: 'Linux',
    command: 'curl -fsSL https://raw.githubusercontent.com/varmiguemunoz/sprintos/main/install.sh | sh',
    comment: '# One-liner install script',
  },
  {
    id: 'windows',
    label: 'Windows',
    command: 'scoop bucket add sprintos https://github.com/varmiguemunoz/scoop-sprintos\nscoop install sprintos',
    comment: '# Scoop package manager',
  },
];

export const installSteps = [
  { step: '1', title: 'Verify GPG', body: 'Ensure your download is authentic via our published public key.' },
  { step: '2', title: 'Link GitHub', body: 'Authorize the CLI to access your issues, PRs, and organizations.' },
  { step: '3', title: 'First Sync', body: 'Populate your local database with your active project and board.' },
];

export const verifyCommand = 'sprintos --version';
