(ns balls.data.go
  (:require [clj-cctray.core :as parser]))

(defn filter-projects
  [projects filter-pattern]
  (if (empty? filter-pattern)
    projects
    (let [filter-fn #(re-matches (re-pattern filter-pattern) (:name %))]
      (->> projects
           (filter filter-fn)))))

(defn- all-projects
  [url]
  (parser/get-projects url {:normalise :all :server :go}))

(defn group-projects
  [projects]
  (->> projects
       (map (juxt :name identity))
       (into {})))

(defn get-filtered-projects
  [url filter-pattern]
  (-> (all-projects url)
      (filter-projects filter-pattern)
      group-projects))

(defn successful-project? [[_ {:keys [activity last-build-status]}]]
  (= [:sleeping :success] [activity last-build-status]))

(defn non-green-project? [p]
  (not (successful-project? p)))


(defn get-successful-builds [url filter-pattern]
  (->> (get-filtered-projects url filter-pattern)
       (filter successful-project?)
       (into {})))

(defn get-non-green-builds [url filter-pattern]
  (->> (get-filtered-projects url filter-pattern)
       (filter non-green-project?)
       (into {})))