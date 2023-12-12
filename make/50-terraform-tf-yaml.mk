SDLC_TERRAFORM_YAML_SRC:=$(shell find $(SRC)/terraform -name "*.yaml")
SDLC_TERRAFORM_YAML_BUILT:=$(patsubst $(SRC)/%, $(DIST)/%, $(SDLC_TERRAFORM_YAML_SRC))

BUILD_TARGETS+=$(SDLC_TERRAFORM_YAML_BUILT)

$(SDLC_TERRAFORM_YAML_BUILT): $(DIST)/%: $(SRC)/%
	mkdir -p $(dir $@)
	cp $< $@
