SDLC_README_INTRO:=$(SRC)/README-intro.md
SDLC_TF_ASSETS:=$(shell find $(SRC)/terraform \( -name "*.tf" -o -name "*.md" -o -name "*.png" \) -not -name 'README.md')
SDLC_TF_DOCS_CONFIG:=$(SRC)/terraform/doc-assets/terraform-doc.config.yaml
SDLC_TERRAFORM_READMES:=$(SRC)/terraform/README.md $(SRC)/terraform/modules/vm-instance/README.md

BUILD_TARGETS+=$(SDLC_TERRAFORM_READMES) README.md

README.md: $(SDLC_CLOUDCRAFT_JS) $(SDLC_README_INTRO)
	cp $(SDLC_README_INTRO) $@
	$(SDLC_CLOUDCRAFT_EXEC_JS) document >> $@

$(SDLC_TERRAFORM_READMES): $(SDLC_TF_ASSETS) $(SDLC_TF_DOCS_CONFIG)
	terraform-docs markdown --config $(SDLC_TF_DOCS_CONFIG) $(SRC)/terraform/
