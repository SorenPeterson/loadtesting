require 'ruby-jmeter'

def url(route)
  'https://local.marqeta.com:8080/v3' + route
end

test do  
  with_json
  threads 1, loops: 5 do
    get name: 'Users Index',
        url: url('/users')
  end
end.run
