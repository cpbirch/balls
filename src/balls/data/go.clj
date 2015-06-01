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

(defn fetch-cctray [url]
	(let [server-type (server/type url)]
		(if (= :unknown server-type)
			[url server-type]
			[(:body (client/get url {:timeout 10000 :headers (merge {"Accept" "application/xml"} (basic-auth-header)) :as :stream :insecure? true})) server-type])))

(defn parse-cctray [[xml-data server-type]]
	(parser/get-projects xml-data {:normalise :all :server server-type}))

(def all-projects (comp parse-cctray fetch-cctray))

(defn- exclude-projects [projects exclude-pattern]
	(if (empty? exclude-pattern)
		projects
		(let [by-name #(re-matches (re-pattern exclude-pattern) (:name %))]
			(->> projects (remove by-name)))))

(defn- interesting-projects [url select-pattern exclude-pattern]
	(-> (all-projects url)
			(select-projects select-pattern)
			(exclude-projects exclude-pattern)))

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