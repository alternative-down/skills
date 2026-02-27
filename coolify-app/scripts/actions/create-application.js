#!/usr/bin/env node

/**
 * Create a new Coolify application from a GitHub repository
 * Supports both public and private repositories via GitHub App
 * 
 * Usage: node create-application.js <name> <git_repository> <git_branch> [options]
 * 
 * Options (at least one of project_uuid OR environment_uuid required):
 *   --project-uuid=<uuid>      Project UUID (if not using environment)
 *   --environment-uuid=<uuid>  Environment UUID (if not using project)
 *   --server-uuid=<uuid>       Server UUID (optional, uses default if not provided)
 *   --github-app-uuid=<uuid>   GitHub App UUID (for private repos)
 *   --buildpack=<type>         Build pack: nixpacks, static, dockerfile, dockercompose (default: nixpacks)
 *   --ports=<ports>            Ports to expose (default: 3000)
 *   --description=<desc>       Application description
 *   --domain=<domain>          Custom domain(s) for the application
 *   --install-cmd=<cmd>        Install command
 *   --build-cmd=<cmd>          Build command
 *   --start-cmd=<cmd>          Start command
 *   --base-dir=<dir>           Base directory (default: /)
 *   --publish-dir=<dir>        Publish directory (for static apps)
 *   --is-static                Mark as static application
 *   --is-spa                   Mark as SPA (single-page application)
 *   --auto-deploy              Enable auto-deploy on git push (default: true)
 *   --force-https              Force HTTPS (default: true)
 * 
 * Examples:
 *   # Create app for default environment with GitHub App
 *   node create-application.js my-app alternative-down/landing-page main \\
 *     --environment-uuid=k8ow4o0o440088s08gwcwsc4 \\
 *     --github-app-uuid=xxx --buildpack=nixpacks
 *   
 *   # Create static app
 *   node create-application.js my-landing alternative-down/landing-page main \\
 *     --environment-uuid=k8ow4o0o440088s08gwcwsc4 \\
 *     --is-static --publish-dir=dist --buildpack=static
 */

const { makeRequest } = require('../utilities/api-helper');

function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: node create-application.js <name> <git_repository> <git_branch> [options]');
    console.error('Example: node create-application.js landing-page alternative-down/landing-page main --environment-uuid=xxx');
    process.exit(1);
  }

  const name = args[0];
  const git_repository = args[1];
  const git_branch = args[2];

  const options = {
    projectUuid: null,
    environmentUuid: null,
    serverUuid: null,
    githubAppUuid: null,
    buildpack: 'nixpacks',
    portsExposes: '3000',
    description: '',
    domain: null,
    installCmd: null,
    buildCmd: null,
    startCmd: null,
    baseDir: '/',
    publishDir: null,
    isStatic: false,
    isSpa: false,
    autoDeploy: true,
    forceHttps: true
  };

  args.slice(3).forEach(arg => {
    if (arg.startsWith('--project-uuid=')) {
      options.projectUuid = arg.split('=')[1];
    } else if (arg.startsWith('--environment-uuid=')) {
      options.environmentUuid = arg.split('=')[1];
    } else if (arg.startsWith('--server-uuid=')) {
      options.serverUuid = arg.split('=')[1];
    } else if (arg.startsWith('--github-app-uuid=')) {
      options.githubAppUuid = arg.split('=')[1];
    } else if (arg.startsWith('--buildpack=')) {
      options.buildpack = arg.split('=')[1];
    } else if (arg.startsWith('--ports=')) {
      options.portsExposes = arg.split('=')[1];
    } else if (arg.startsWith('--description=')) {
      options.description = arg.split('=')[1];
    } else if (arg.startsWith('--domain=')) {
      options.domain = arg.split('=')[1];
    } else if (arg.startsWith('--install-cmd=')) {
      options.installCmd = arg.split('=')[1];
    } else if (arg.startsWith('--build-cmd=')) {
      options.buildCmd = arg.split('=')[1];
    } else if (arg.startsWith('--start-cmd=')) {
      options.startCmd = arg.split('=')[1];
    } else if (arg.startsWith('--base-dir=')) {
      options.baseDir = arg.split('=')[1];
    } else if (arg.startsWith('--publish-dir=')) {
      options.publishDir = arg.split('=')[1];
    } else if (arg === '--is-static') {
      options.isStatic = true;
    } else if (arg === '--is-spa') {
      options.isSpa = true;
    } else if (arg === '--auto-deploy') {
      options.autoDeploy = true;
    } else if (arg === '--no-auto-deploy') {
      options.autoDeploy = false;
    } else if (arg === '--force-https') {
      options.forceHttps = true;
    } else if (arg === '--no-force-https') {
      options.forceHttps = false;
    }
  });

  // Validate required fields
  if (!options.environmentUuid && !options.projectUuid) {
    console.error('Error: You must provide either --environment-uuid or --project-uuid');
    process.exit(1);
  }

  if (!options.githubAppUuid) {
    console.error('Error: You must provide --github-app-uuid');
    process.exit(1);
  }

  return { name, git_repository, git_branch, ...options };
}

async function main() {
  const {
    name,
    git_repository,
    git_branch,
    projectUuid,
    environmentUuid,
    serverUuid,
    githubAppUuid,
    buildpack,
    portsExposes,
    description,
    domain,
    installCmd,
    buildCmd,
    startCmd,
    baseDir,
    publishDir,
    isStatic,
    isSpa,
    autoDeploy,
    forceHttps
  } = parseArgs();

  try {
    // Build payload for GitHub App application
    const payload = {
      name,
      git_repository,
      git_branch,
      github_app_uuid: githubAppUuid,
      build_pack: buildpack,
      ports_exposes: portsExposes,
      description: description || `${name} application`,
      base_directory: baseDir,
      is_auto_deploy_enabled: autoDeploy,
      is_force_https_enabled: forceHttps,
      is_static: isStatic,
      is_spa: isSpa
    };

    // Add optional fields
    if (environmentUuid) payload.environment_uuid = environmentUuid;
    if (projectUuid) payload.project_uuid = projectUuid;
    if (serverUuid) payload.server_uuid = serverUuid;
    if (domain) payload.domains = domain;
    if (installCmd) payload.install_command = installCmd;
    if (buildCmd) payload.build_command = buildCmd;
    if (startCmd) payload.start_command = startCmd;
    if (publishDir) payload.publish_directory = publishDir;

    console.log('📦 Creating application via GitHub App...');
    console.log(`   Name: ${name}`);
    console.log(`   Repository: ${git_repository}#${git_branch}`);
    console.log(`   Build Pack: ${buildpack}`);
    console.log(`   Ports: ${portsExposes}`);
    console.log(`   Environment UUID: ${environmentUuid || 'N/A'}`);
    console.log(`   Project UUID: ${projectUuid || 'N/A'}`);
    console.log('');

    const result = await makeRequest('POST', '/applications/private-github-app', payload);
    
    if (result.status !== 201 && result.status !== 200) {
      console.error(`✗ Error: ${result.status}`);
      console.error(JSON.stringify(result.body, null, 2));
      process.exit(1);
    }

    const application = result.body.data || result.body;
    console.log(`✓ Application created successfully!`);
    console.log(`  UUID: ${application.uuid || 'N/A'}`);
    console.log(`  FQDN: ${application.fqdn || 'N/A'}`);
    console.log(`  Status: ${application.status || 'pending'}`);
    console.log('');
    console.log('Full response:');
    console.log(JSON.stringify(application, null, 2));
  } catch (err) {
    console.error('✗ Request failed:', err.message);
    process.exit(1);
  }
}

main();
