(ns balls.data.go
  (:require [clj-cctray.core :as parser]))

(defn filter-projects
  [projects filter-pattern]
  (if (empty? filter-pattern)
    projects
    (let [filter-fn #(re-matches (re-pattern filter-pattern) (first %))]
      (->> projects
           (filter filter-fn)
           (into {})))))

(defn group-projects [projects]
  (let [group-by-name (fn [result curr]
                        (-> result (assoc (:name curr) curr)))]
    (reduce group-by-name {} projects)))

(defn get-all-projects
  ([url]
    (get-all-projects url nil))
  ([url filter-pattern]
    (let [all-projects (parser/get-projects url {:normalise :all :server :go})
          grouped (group-projects all-projects)
          filtered (filter-projects grouped filter-pattern)]
      {:projects filtered})))