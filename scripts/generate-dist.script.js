const { execSync } = require('child_process');

const collectWorkspaceModules = (env) => {
    const modules = [];
    for (const key in env) {
        if (key.startsWith('npm_package_workspaces_')) {
            modules.push(env[key]);
        }
    }
    return modules;
}

const generateDeploymentPipeline = (modules) => {
    return modules.map(module => {
        const moduleName = module.split('/').pop();
        return `yarn workspace @modules/${moduleName} generate:dist`;
    }).join(' && ');
}

const workspaceModules = collectWorkspaceModules(process.env);

const deploymentPipeline = generateDeploymentPipeline(workspaceModules);

try {
    execSync(deploymentPipeline, { stdio: 'inherit' });
} catch (error) {
    console.error(error);
    process.exit(1);
}