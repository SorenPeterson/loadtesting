require 'ruby-jmeter'

test do  
  with_json
  threads 1, loops: 5 do
    get name: 'get_products_index',
        url: 'http://example-rest-api.herokuapp.com/api/products'
  end
end.run
