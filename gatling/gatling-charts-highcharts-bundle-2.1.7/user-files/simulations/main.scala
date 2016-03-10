import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class BasicUserCreation extends Simulation {

  // Gatling Docs
  // HTTP Requests: http://gatling.io/docs/2.0.0-RC2/http/http_request.html
  // HTTP Checks (asserts): http://gatling.io/docs/2.0.0-RC2/http/http_check.html#http-check

  /*
  // All the headers in one

  val all_headers = Map("Content-Type" -> "application/json",
                        "Accept" -> "application/json", 
                        "Authorization" -> "Basic YWRtaW5fY29uc3VtZXI6bWFycWV0YQ==")

  // Just specific headers for adding individually

  val content_type = ("Content-Type", "application/json")
  val credz = ("Authorization", "Basic YWRtaW5fY29uc3VtZXI6bWFycWV0YQ==")
  */

  /* 
  // you can also have JSON files elsewhere that you import rather than building inline
  ./user-files/request-bodies/myFileBody.json
  { "myContent": "${myValue}" }
  .body(ELFileBody("myFileBody.json")).asJSON
  */

  val httpConf = http
    .baseURL("http://local.marqeta.com:8080/v3") // Here is the root for all relative URLs
    .acceptHeader("text/html,application/json,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8") // Here are the common headers
    .doNotTrackHeader("1")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .acceptEncodingHeader("gzip, deflate")
    .userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0")

  object CreateUser {
    val create_users_forever = forever(
      exec(http("POST lots of users")
        // the method and first class endpoint
        .post("/users")
        .basicAuth("admin_consumer", "marqeta") // helper! not necessary, but alternative to credz
        .body(StringBody("""{}"""))
        .asJSON // helper! not necessary, but defines request body format and dictates required response format
        .check(status.is(201))
      ).exec(print(1))
    )
    
    val create_user = exec(http("POST a user")
      // the method and first class endpoint
      .post("/users")
      .basicAuth("admin_consumer", "marqeta") // helper! not necessary, but alternative to credz
      .body(StringBody("""{}"""))
      .asJSON // helper! not necessary, but defines request body format and dictates required response format
      .check(status.is(201))
    )
  }

  val users = scenario("Authorization").exec(CreateUser.create_user, CreateUser.create_users_forever)

  setUp(
    users.inject(
      constantUsersPerSec(1) during(120 seconds)
    ).protocols(httpConf)
  )
}
