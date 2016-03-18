(ns balls.data.go
	(:require [clj-cctray.core :as parser]
						[balls.data.events :as events]
						[balls.data.server :as server]
						[balls.config :as config]
						[clojure.string :as clj-str]
						[base64-clj.core :as base64]
						[clj-http.client :as client]))

(defn- select-projects
	[projects select-pattern]
	(if (empty? select-pattern)
		projects
		(let [by-name #(re-matches (re-pattern select-pattern) (:name %))]
			(->> projects
					 (filter by-name)))))

(defn basic-auth-header []
	(when-let [credentials (config/credentials)]
		{"Authorization" (str "Basic " (base64/encode (clj-str/join ":" credentials)))}))

(def headers (merge {"Accept" "application/xml"} (basic-auth-header)))


(defn fetch-cctray [url server-type]	
	(if (= :unknown server-type)
		[url server-type]
		[(:body (client/get 
			url 
			{:timeout 10000 :headers headers :as :stream :insecure? true})) 
		server-type]))

(defn parse-cctray [[xml-data server-type]]
	(parser/get-projects xml-data {:normalise :all :server server-type}))

(def all-projects (comp parse-cctray fetch-cctray))

(defn- exclude-projects [projects exclude-pattern]
	(if (empty? exclude-pattern)
		projects
		(let [by-name #(re-matches (re-pattern exclude-pattern) (:name %))]
			(->> projects (remove by-name)))))

(defn- with-stage
  [{:keys [name stage] :as data}]
  (assoc data :name (format "%s%s%s" name (config/stage-delimiter) stage)))

(defn- add-stage?
  [server-type]
  (cond (= :snap server-type) true
        (= :go server-type) true
        :default false))

(defn- add-stage
  [data server-type]
  (if (add-stage? server-type)
    (map with-stage data)
    data))

(defn- interesting-projects [url select-pattern exclude-pattern]
  (let [server-type (server/type url)]
    (-> (all-projects url server-type)
        (select-projects select-pattern)
        (exclude-projects exclude-pattern)
        (add-stage server-type))))

(defn find-names
	[{:keys [url select exclude]}]
	(if-not (empty? url)
		{:names (->> (interesting-projects url select exclude) (map :name))}
		{:name []}))

(defn get-filtered-projects
	[{:keys [url select exclude] :as params}]
	(->> (interesting-projects url select exclude)
			 (group-by :prognosis)
			 (events/add-ui-events params)))
