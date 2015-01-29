(ns balls.data.go
  (:require [clj-cctray.core :as parser]
            [clj-cctray.filtering :as filtering]
            [clojure.string :refer [blank?]]))

(defn get-all-projects [url]
  {:projects (parser/get-projects url {:normalise :all :server :go})})