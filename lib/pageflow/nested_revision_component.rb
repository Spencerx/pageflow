module Pageflow
  # Include in models that are declared as nested revision components
  # of other revision components.
  #
  # @since 15.5
  module NestedRevisionComponent
    # Shared functionality of revision components and nested revision
    # components.
    module Container
      extend ActiveSupport::Concern

      included do
        cattr_accessor :nested_revision_component_collection_names, default: []
      end

      # Macro methods to declare nested revision components
      module ClassMethods
        # Call this macro in the body of a class which includes
        # `RevisionComponent` or `NestedRevisionComponent` and pass
        # the name of an association that shall be included when the
        # revision component is copied to a new revision. The
        # associated model needs to be a `NestedRevisionComponent`.
        def nested_revision_components(*collection_names)
          self.nested_revision_component_collection_names = collection_names
        end
      end
    end

    extend ActiveSupport::Concern
    include Container

    def duplicate
      record = dup
      record.perma_id = nil

      yield record if block_given?

      record.save!

      NestedRevisionComponentCopy.new(
        from: self,
        to: record,
        reset_perma_ids: true
      ).perform_for_nested_revision_components

      record
    end
  end
end
