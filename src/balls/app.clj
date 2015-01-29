(ns balls.app
  (:require [compojure.handler :as handler]
            [compojure.route :as route]
            [balls.data.go :as go]
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

(defn- filtered-projects [params]
  (go/get-filtered-projects (:url params) (:filter params)))

(defroutes main-routes
  (GET "/" []
       (index-page/contents))

  (GET "/pipelines" {params :params}
       (-> params
           filtered-projects
           as-json-response))

  (GET "/filternames" {params :params}
       (let [names (-> (filtered-projects params) keys)]
         (-> {:names names} as-json-response)))

  (GET "/successfulpipelines" {params :params}
       (-> (go/get-successful-builds (:url params) (:filter params))
           as-json-response))

  (GET "/nongreenpipelines" {params :params}
       (-> (go/get-non-green-builds (:url params) (:filter params))
           as-json-response))

  (route/resources "/"))

(def app
  (handler/api main-routes))
