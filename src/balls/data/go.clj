(ns balls.data.go
  (:require [clj-cctray.core :as parser]))

(defn- filter-projects
  [projects filter-pattern]
  (if (empty? filter-pattern)
    projects
    (let [filter-fn #(re-matches (re-pattern filter-pattern) (:name %))]
      (->> projects
           (filter filter-fn)))))

(defn- all-projects
  [url]
  (parser/get-projects url {:normalise :all :server :go}))

(defn- interesting-projects [url filter-pattern]
  (-> (all-projects url)
      (filter-projects filter-pattern)))

(defn filter-names
  [{:keys [url filter]}]
  {:names (->> (interesting-projects url filter) (map :name))})

(defn get-filtered-projects
  [{:keys [url filter]}]
  (->> (interesting-projects url filter)
      (group-by :prognosis)))