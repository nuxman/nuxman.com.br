require 'i18n'

LOCALE = 'pt-BR' # set your locale

# Create folder "_locales" and put some locale file from https://github.com/svenfuchs/rails-i18n/tree/master/rails/locale
module Jekyll
  module I18nFilter
    # Example:
    #   {{ post.date | localize: "%d.%m.%Y" }}
    #   {{ post.date | localize: ":short" }}
    def localize(input, format=nil)
      load_translations
      format = (format =~ /^:(\w+)/) ? $1.to_sym : format
      I18n.l input, :format => format, :locale => LOCALE
    end

    def load_translations
      unless I18n::backend.instance_variable_get(:@translations) and locale_file_exists
        I18n.backend.load_translations Dir[File.join(File.dirname(__FILE__),'../_locales/*.yml')]
      end
    end

    def locale_file_exists
      file_name = File.join(LOCALE,'.yml')
      return (locale_file_exists_in_current_dir(file_name) and locale_exists_in_locales_dir(file_name))
    end

    def locale_file_exists_in_current_dir(file_name)
        return File.exists?(File.join(File.dirname(__FILE__),file_name))
    end

    def locale_exists_in_locales_dir(file_name)
        return File.exists?(File.join('../_locales/',file_name))
    end
  end
end

Liquid::Template.register_filter(Jekyll::I18nFilter)
