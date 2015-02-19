(ns balls.app
  (:require [compojure.handler :as handler]
            [compojure.route :as route]
            [balls.data.go :as go]
            [balls.config :as config]
            [balls.views.index :as index-page]
            [cheshire.core :refer [generate-string]]
            [cheshire.generate :as cheshire])
  (:use [compojure.core])
  (import org.joda.time.DateTime)
  )

(cheshire/add-encoder DateTime (fn [date json-generator]
                                 (.writeString json-generator (.toString date))))

(defn- as-json-response [body]
  {:body         (generate-string body)
   :headers      {"Access-Control-Allow-Origin" "*"
                  "content-type" "application/json"}})

(defn- convert-to-number [p params]
  (if-let [v (p params)]
    (assoc params p (read-string v))
    params))

(defroutes main-routes
  (GET "/" []
       (index-page/contents))

  (GET "/pipelines" {params :params}
       (->> params
           (convert-to-number :red-alert-threshold)
           (convert-to-number :glitch-effect-threshold)
           config/override-config-data
           go/get-filtered-projects
           as-json-response))

  (GET "/filternames" {params :params}
       (-> params
           config/override-url
           go/find-names
           as-json-response))

  (route/resources "/"))

(def app
  (handler/api main-routes))
