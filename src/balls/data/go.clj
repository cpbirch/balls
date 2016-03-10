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

(defn- replace-spaces-with-hyphens [string]
	(clj-str/replace string #"\s" "-"))

(defn- add-stage-to-name [{name :name stage :stage :as data}]
	(let [name-with-stage (replace-spaces-with-hyphens (str name "-" stage))]
		(assoc data :name (str name "-" stage))))

(defn- add-stage-to-name-if-snap [data, server-type]
	(if (= :snap server-type)
		(map add-stage-to-name data)
		data))

(defn- interesting-projects [url select-pattern exclude-pattern]
	(let [server-type (server/type url)]
		(-> (all-projects url server-type)
			(select-projects select-pattern)
			(exclude-projects exclude-pattern)
			(add-stage-to-name-if-snap server-type))))

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
