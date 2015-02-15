(ns balls.data.events)

(defn- add-red-alert [{:keys [sick] :as grouped-pipelines}]
  (let [over-threshold (>= (count sick) 5)]
    (assoc grouped-pipelines :red-alert over-threshold)))

(defn- add-glitch-effect [{:keys [sick] :as grouped-pipelines}]
  (let [over-threshold (>= (count sick) 3)]
    (assoc grouped-pipelines :glitch over-threshold)))


(defn add-ui-events [grouped-pipelines]
  (-> grouped-pipelines
      add-red-alert
      add-glitch-effect))
