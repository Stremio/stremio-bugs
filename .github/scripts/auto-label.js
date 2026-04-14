const platform = (value) => `###.+Platform\\s+${value}\\s+###`;
const name = (name) => platform(`${name}.*`);
const variant = (suffix) => platform(`.+${suffix}`);

const LABELS_MAP = [
    {
        pattern: name('Android TV'),
        label: 'android-tv',
    },
    {
        pattern: name('Android Mobile'),
        label: 'android-mobile',
    },
    {
        pattern: name('iOS'),
        label: 'apple-ios',
    },
    {
        pattern: name('tvOS'),
        label: 'apple-tv',
    },
    {
        pattern: name('macOS'),
        label: 'apple-mac',
    },
    {
        pattern: name('web'),
        label: 'web',
    },
    {
        pattern: name('Windows'),
        label: 'windows',
    },
    {
        pattern: name('Samsung Native TV'),
        label: 'smart-tv',
    },
    {
        pattern: name('LG Native TV'),
        label: 'smart-tv',
    },
    {
        pattern: name('Hisense Native TV'),
        label: 'smart-tv',
    },
    {
        pattern: variant('VR'),
        label: 'vr',
    },
    {
        pattern: variant('Beta'),
        label: 'beta',
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

        if (newLabels.length > 0) {
            await github.rest.issues.addLabels({
                owner,
                repo,
                issue_number,
                labels: newLabels,
            });
        }
    }
};
