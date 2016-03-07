require 'ruby-jmeter'

test do  
  with_json
  threads 1, loops: 5 do
    get name: 'ping',
        url:   'http://local.marqeta.com:8080/v3/ping'
  end
end.run
