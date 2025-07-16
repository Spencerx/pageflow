module PageflowScrolled
  # @api private
  module CacheHelper
    def cache_scrolled_entry(entry:, widget_scope:, &)
      condition =
        widget_scope == :published &&
        entry.feature_state('scrolled_entry_fragment_caching')
      cache_if(condition, [entry, :head_and_body, widget_scope], &)
    end
  end
end
