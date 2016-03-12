(ns balls.core
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [environ.core :refer [env]]
            [balls.app :refer [app]])
  (:gen-class))

(def port (Integer. (or (env :port) 3000)))

(defn -main
  [& _args]
  (run-jetty app {:port port :join? false}))
