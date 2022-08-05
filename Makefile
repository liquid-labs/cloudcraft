.DELETE_ON_ERROR:
	
.PHONY: all build clean default dependency-graph set-bucket-var test-gcloud-connection test-var-file-exists
 # suppress implict rules
MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --no-builtin-variables
.SUFFIXES:

default: build

BASH:=$(shell which bash)
SHELL:=$(BASH)

YQ:=$(shell which yq)
TERRAFORM:=$(shell which terraform)
GCLOUD_ACCOUNT:=$(LL_MINECRAFT_GCLOUD_ACCOUNT)
GCLOUD_CONNECTION_TEST:=gcloud projects list --account $(GCLOUD_ACCOUNT)
VAR_FILE:=liquid-minecraft.tfvars.json

SRC_DIR:=./src
BUILD_DIR:=./build
STAGING_DIR:=$(BUILD_DIR)/staging
INIT_LOCK:=$(BUILD_DIR)/.terraform.lock.hcl

MAIN_SRC:=$(SRC_DIR)/main.tf.yaml
STAGED_MAIN:=$(STAGING_DIR)/main.tf.yaml
MAIN_FILE:=$(BUILD_DIR)/main.tf.json

BUILD_TARGETS:=$(INIT_LOCK)

build: test-gcloud-connection $(BUILD_TARGETS)

all: build

clean:
	rm -rf $(BUILD_DIR)

test-gcloud-connection:
	@test -n "$(GCLOUD_ACCOUNT)" \
		|| { \
			echo -e "No gcloud account defined; try:\n\nexport LL_MINECRAFT_GCLOUD_ACCOUNT=you@some-domain.com\n"; \
			exit 1; \
		}
	@$(GCLOUD_CONNECTION_TEST) 2>&1 > /dev/null \
		|| { \
			echo -e "Test command '$(GCLOUD_CONNECTION_TEST)' failed; try:\n\ngcloud auth login\n"; \
			exit 1; \
		}

test-var-file-exists:
	@test -f $(VAR_FILE) || { \
		echo -e "Did not find expected $(VAR_FILE); populate with entries for:\n  - bucket\n  - credentials_file\n  - org_id\n  - project\n  - project_id"; \
		exit 1; \
	}

EXTRACT_BUCKET_VALUE_CMD:=$(shell cat $(VAR_FILE) | jq -r '.bucket // empty')
set-bucket-name-var: test-var-file-exists
	@test -n "$(EXTRACT_BUCKET_VALUE_CMD)" || { \
		echo -e "'bucket' not defined in $(VAR_FILE); define and re-run"; \
		exit 1; \
	}
	$(eval BUCKET_NAME:=$(EXTRACT_BUCKET_VALUE_CMD))

$(STAGED_MAIN): $(MAIN_SRC) set-bucket-name-var
	@test -d "$(dir $@)" || mkdir -p "$(dir $@)"
	sed -E 's/~~.+~~/$(BUCKET_NAME)/' "$<" > "$@"

$(MAIN_FILE): $(STAGED_MAIN) # the base yaml files contain bits to be replaced, so we create a staged file
	@test -d "$(dir $@)" || mkdir -p "$(dir $@)"
	cat "$<" | $(YQ) > "$@"

$(INIT_LOCK): $(MAIN_FILE)
	cd $(BUILD_DIR) && $(TERRAFORM) init -var-file="liquid-minecraft.tfvars"

# Utility rules
dependency-graph: dependencies.png

dependencies.png:
	make -Bnd | make2graph | dot -Tpng -o "$@"
