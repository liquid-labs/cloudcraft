SDLC_TERRAFORM_YAML_BUILT=$(DIST)/cloudcraft.tf.yaml
SDLC_TERRAFORM_YAML_SRC=$(SRC)/terraform/main.tf.yaml
BUILD_TARGETS+=$(SDLC_TERRAFORM_YAML_BUILT)

$(SDLC_TERRAFORM_YAML_BUILT): $(SDLC_TERRAFORM_YAML_SRC)
	cp $< $@