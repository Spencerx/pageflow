require 'spec_helper'

module PageflowScrolled
  RSpec.describe SprocketsHelper, type: :helper do
    describe '#scrolled_sprockets_asset_tags' do
      it 'includes legacy javascript tag by default' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_sprockets_asset_tags(entry, entry_mode: :published)

        expect(result).to have_selector(
          'script[src*="pageflow_scrolled/legacy"]',
          visible: false
        )
      end

      it 'does not include legacy javascript tag when disabled' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.include_legacy_frontend_javascript = false
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_sprockets_asset_tags(entry, entry_mode: :published)

        expect(result).not_to have_selector(
          'script[src*="pageflow_scrolled/legacy"]',
          visible: false
        )
      end

      it 'includes ui stylesheet in preview mode' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_sprockets_asset_tags(entry, entry_mode: :preview)

        expect(result).to have_selector(
          'link[href*="pageflow_scrolled/ui"]',
          visible: false
        )
      end

      it 'includes ui stylesheet in editor mode' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_sprockets_asset_tags(entry, entry_mode: :editor)

        expect(result).to have_selector(
          'link[href*="pageflow_scrolled/ui"]',
          visible: false
        )
      end

      it 'does not include ui stylesheet in published mode' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_sprockets_asset_tags(entry, entry_mode: :published)

        expect(result).not_to have_selector(
          'link[href*="pageflow_scrolled/ui"]',
          visible: false
        )
      end
    end
  end
end
