/** 
 * TODO:
 *  - finalizeUploadsForOrder(orderId, payerUid, uploadIds[]) — copy/move files from user temp path to orders/{orderId}/prints/{filename}, generate signed download URLs if desired, update uploads docs with attachedToOrder and update orders/{orderId} with the prints array containing final metadata.
 *  - cleanupOrphanUploads(uid, maxAgeHours) — optional cron job to remove un-attached uploads.
*/
