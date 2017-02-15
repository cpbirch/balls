(ns balls.core
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [environ.core :refer [env]]
            [balls.app :refer [app]]
            [balls.config :as config])
  (:gen-class))

(def port (Integer. (or (env :port) 3000)))

(defn -main
  [& _args]
  (config/config-from-file)
  (run-jetty app {:port port :join? false}))
