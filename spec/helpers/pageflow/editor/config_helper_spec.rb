require 'spec_helper'

module Pageflow
  describe Editor::ConfigHelper do
    describe '#editor_config_seeds' do
      it 'includes confirm_encoding_jobs option' do
        Pageflow.config.confirm_encoding_jobs = true

        result = JSON.parse(helper.editor_config_seeds(create(:entry)))

        expect(result['confirmEncodingJobs']).to eq(true)
      end

      it 'includes file type collection names' do
        result = JSON.parse(helper.editor_config_seeds(create(:entry)))

        expect(result['fileTypes'][0]['collectionName']).to eq('image_files')
      end

      it 'does not include file types of disabled feature' do
        pageflow_configure do |config|
          config.features.register('test_file_type') do |feature_config|
            TestFileType.register(feature_config, collection_name: 'test')
          end
        end

        result = JSON.parse(helper.editor_config_seeds(create(:entry)))

        expect(result['fileTypes'].map { |h| h['collectionName'] }).not_to include('test')
      end

      it 'includes file types of enabled feature' do
        pageflow_configure do |config|
          config.features.register('test_file_type') do |feature_config|
            TestFileType.register(feature_config, collection_name: 'test')
          end
        end
        entry = create(:entry, with_feature: 'test_file_type')

        result = JSON.parse(helper.editor_config_seeds(entry))

        expect(result['fileTypes'].map { |h| h['collectionName'] }).to include('test')
      end

      it 'includes nested file type collection names' do
        result = JSON.parse(helper.editor_config_seeds(create(:entry)))

        expect(result['fileTypes'][3]['collectionName']).to eq('text_track_files')
      end

      it 'includes file licenses' do
        Pageflow.config.available_file_licenses = [:cc0, :cc_by]

        result = JSON.parse(helper.editor_config_seeds(create(:entry)))

        expect(result['availableFileLicenses']).to eq(['cc0', 'cc_by'])
      end

      it 'includes available locales' do
        Pageflow.config.available_locales = [:de, :fr]

        result = JSON.parse(helper.editor_config_seeds(create(:entry)))

        expect(result['availableLocales']).to eq(['de', 'fr'])
      end

      it 'includes available public locales' do
        Pageflow.config.available_public_locales = [:fr]

        result = JSON.parse(helper.editor_config_seeds(create(:entry)))

        expect(result['availablePublicLocales']).to eq(['fr'])
      end

      it 'includes edit lock interval' do
        Pageflow.config.edit_lock_polling_interval = 5.seconds

        result = JSON.parse(helper.editor_config_seeds(create(:entry)))

        expect(result['editLockPollingIntervalInSeconds']).to eq(5)
      end

      it 'includes enabled file importers' do
        user = create(:user)
        file_importer = TestFileImporter.new
        pageflow_configure do |config|
          config.features.register('test_file_importer') do |feature_config|
            feature_config.file_importers.register(file_importer)
          end
        end
        entry = create(:entry, with_editor: user, with_feature: :test_file_importer)
        allow(helper).to receive(:current_user) { user }

        result = JSON.parse(helper.editor_config_seeds(entry))
        expect(result['fileImporters'].first).to include('importerName' => file_importer.name)
      end

      it 'does not include disabled file importers data' do
        file_importer = TestFileImporter.new
        pageflow_configure do |config|
          config.features.register('test_file_importer') do |feature_config|
            feature_config.file_importers.register(file_importer)
          end
        end

        result = JSON.parse(helper.editor_config_seeds(create(:entry)))
        expect(result['fileImporters']).to be_empty
      end

      it 'includes default published_until duration option' do
        result = JSON.parse(helper.editor_config_seeds(create(:entry)))

        expect(result['defaultPublishedUntilDurationInMonths']).to eq(12)
      end

      it 'allows overrriding default published_until duration in config' do
        Pageflow.config.default_published_until_duration_in_months = 24

        result = JSON.parse(helper.editor_config_seeds(create(:entry)))

        expect(result['defaultPublishedUntilDurationInMonths']).to eq(24)
      end

      it 'includes entry structured data type names' do
        pageflow_configure do |config|
          config.entry_structured_data_types.register(:faq_page, lambda do |_entry|
            {'@type' => 'FAQPage'}
          end)
        end

        result = JSON.parse(helper.editor_config_seeds(create(:entry)))

        expect(result['entryStructuredDataTypes']).to include('article', 'faq_page')
      end

      it 'does not include entry structured data types from disabled features' do
        pageflow_configure do |config|
          config.features.register('custom_type') do |feature_config|
            feature_config.entry_structured_data_types.register(:report, lambda do |_entry|
              {'@type' => 'Report'}
            end)
          end
        end

        result = JSON.parse(helper.editor_config_seeds(create(:entry)))

        expect(result['entryStructuredDataTypes']).not_to include('report')
      end

      it 'includes entry structured data types from enabled features' do
        pageflow_configure do |config|
          config.features.register('custom_type') do |feature_config|
            feature_config.entry_structured_data_types.register(:report, lambda do |_entry|
              {'@type' => 'Report'}
            end)
          end
        end
        entry = create(:entry, with_feature: 'custom_type')

        result = JSON.parse(helper.editor_config_seeds(entry))

        expect(result['entryStructuredDataTypes']).to include('report')
      end
    end
  end
end
