(defproject balls "1.0.0"
  :description "Used to create template for basic clojure server project"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [compojure "1.1.5"]
                 [hiccup "1.0.4"]
                 [clj-cctray "0.8.0"]
                 [ring/ring-json "0.3.1"]]

  :profiles {:dev {:dependencies [[midje "1.6.3"]]
                   :plugins [[lein-midje "3.1.3"]]}}

  :plugins [[lein-ring "0.8.7"]
            [lein-idea "1.0.1"]]

  :aliases {"test" ["midje"]}

  :ring {:handler balls.app/app})

