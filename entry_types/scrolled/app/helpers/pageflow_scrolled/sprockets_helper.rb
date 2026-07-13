module PageflowScrolled
  # @api private
  module SprocketsHelper
    def scrolled_sprockets_asset_tags(entry, entry_mode:)
      tags = []

      if Pageflow.config_for(entry).include_legacy_frontend_javascript
        tags << javascript_include_tag('pageflow_scrolled/legacy')
      end

      tags << stylesheet_link_tag('pageflow_scrolled/ui', media: 'all') if entry_mode != :published

      safe_join(tags)
    end
  end
end
