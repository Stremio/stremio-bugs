const PLATFORM_REGEX = '###.+Platform\\s+';

const LABELS_MAP = [
    {
        pattern: `${PLATFORM_REGEX}Android TV`,
        label: 'android-tv',
    },
    {
        pattern: `${PLATFORM_REGEX}Android Mobile`,
        label: 'android-mobile',
    },
    {
        pattern: `${PLATFORM_REGEX}iOS`,
        label: 'apple-ios',
    },
    {
        pattern: `${PLATFORM_REGEX}tvOS`,
        label: 'apple-tv',
    },
    {
        pattern: `${PLATFORM_REGEX}macOS`,
        label: 'apple-mac',
    },
];

module.exports = async ({ github, context }) => {
    const { owner, repo } = context.repo;
    const { body, number: issue_number, labels } = context.payload.issue;

    const oldLabels = labels.map(({ name }) => name);
    
    const newLabels = LABELS_MAP
        .filter(({ pattern }) => RegExp(pattern, 'i').test(body))
        .map(({ label }) => label);

    if (JSON.stringify(oldLabels) !== JSON.stringify(newLabels)) {
        await github.rest.issues.removeAllLabels({
            owner,
            repo,
            issue_number,
        });

        await github.rest.issues.addLabels({
            owner,
            repo,
            issue_number,
            labels: newLabels,
        });
    }
};
