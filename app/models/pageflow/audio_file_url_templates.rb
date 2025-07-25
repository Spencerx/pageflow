module Pageflow
  class AudioFileUrlTemplates # rubocop:todo Style/Documentation
    def call
      {
        original: url_template(:attachment, :original),
        m4a: url_template(:m4a),
        mp3: url_template(:mp3),
        ogg: url_template(:ogg),
        peak_data: url_template(:peak_data)
      }
    end

    private

    def url_template(attachment_name, *style)
      UrlTemplate.from_attachment(example_file.send(attachment_name), *style)
    end

    def example_file
      @example_file ||= AudioFile.new(id: 0,
                                      file_name: ':basename.:extension',
                                      peak_data_file_name: 'audio.json')
    end
  end
end
