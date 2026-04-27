import os

DEPLOYMENT_ROOT = "/home2/albanygr/public_html/CASE/" #Directory to copy files to
DEPLOYMENT_EXCLUDED_TYPES = ["md", "yml", "py"] #File types to exclude from deployment
DEPLOYMENT_EXCLUDED_OBJECTS = [] #Specific files to exclude from deployment

def is_deployable(filename):
    '''Return whether a file is OK to be deployed.'''
    if filename.startswith(".") or filename in DEPLOYMENT_EXCLUDED_OBJECTS:
        return False
    file_extension = filename.split(".")[-1] # "bootstrap.min.js" -> "js"
    if file_extension in DEPLOYMENT_EXCLUDED_TYPES:
        return False
    return True

def get_deployable():
    '''Return a list of files to deploy.'''
    to_deploy = []
    for filename in os.listdir("."):
        if is_deployable(filename):
            to_deploy.append(filename)
    return to_deploy

def handle_deployment():
    print("New commit detected, pulling changes")
    os.system('git pull')
    deployable = get_deployable()
    print(f"Found {len(deployable)} objects to deploy")
    print(f"Deploying to {DEPLOYMENT_ROOT}")
    os.system(f"/bin/cp -R -t {DEPLOYMENT_ROOT} {' '.join(deployable)}") #Copy everything deployable to DEPLOYMENT_ROOT
    print("Deployment finished")

handle_deployment()
