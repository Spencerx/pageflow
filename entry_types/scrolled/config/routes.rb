PageflowScrolled::Engine.routes.draw do
  scope module: 'editor' do
    shallow do
      resources :storylines do
        resources :chapters do
          collection do
            put :order
          end

          resources :sections do
            collection do
              put :order
            end

            member do
              post :duplicate
            end

            resources :content_elements do
              collection do
                put :batch
                put :order
              end
            end
          end
        end
      end
    end
  end
end
