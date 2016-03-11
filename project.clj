(defproject balls "1.0.0"
  :description "Used to create template for basic clojure server project"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url  "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [compojure "1.5.0"]
                 [hiccup "1.0.5"]
                 [clj-cctray "0.9.1"]
                 [ring/ring-json "0.4.0"]
                 [org.clojure/data.json "0.2.6"]
                 [base64-clj "0.1.1"]
                 [clj-http "2.1.0"]
                 [environ "1.0.2"]
                 [ring/ring-jetty-adapter "1.4.0"]]

  :profiles {:dev     {:dependencies [[midje "1.8.3"]]
                       :plugins      [[lein-midje "3.1.3"]
                                      [lein-ancient "0.6.8"]]}}

  :plugins [[lein-ring "0.9.7"]]

  :aliases {"test" ["midje"]}

  :ring {:handler balls.app/app}

  :main balls.core
  :aot :all
  :uberjar-name "balls-standalone.jar")

